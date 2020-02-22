import React from 'react';
import {render} from 'react-dom';
import Phaser from 'phaser';
import Scene from './config/scene';
import WebFont from 'webfontloader';
import Koji from '@withkoji/vcc';
import './config/grid.js';
import Check from './check';

import { Load } from './game/load';
import { Platform } from './game/platform';
import { Player } from './game/player';
import { Grid } from './game/grid';
import { Score } from './game/score';
import { Home } from './game/home';
import { MiniScore } from './game/mini-score';
import { BackgroundParallax } from './game/background';
import { Sounds } from './game/sound';
import { Tutorial } from './game/tutorial';
import { Leaderboard } from './game/leaderboard';

import App from './post.js';

console.log(Koji.config)

function getFontFamily(ff) {
  const start = ff.indexOf('family=');
  let string = '';

  if(start === -1) return 'sans-serif';
  let end = ff.indexOf('&', start);
  if(end === -1) end = undefined;
  ff = ff.slice(start + 7, end);
  ff = ff.split('+');

  for(let i = 0; i < ff.length; i++){
    string += ff[i];
    if(i < ff.length-1) string += ' ';
  }

  return string;
}


window.Data = {
    color: Koji.config.general.colors,
    logo: {name: Koji.config.general.name, image: Koji.config.general.logo.length == 0 ? undefined : Koji.config.general.logo},
    playButton: Koji.config.general.playButton,
    backgrounds: Koji.config.general.background.data,
    fontFamily: getFontFamily(Koji.config.general.fontFamily),

    //main
    play: null,
    go: true,

    //sounds
    sounds: {
        on: Koji.config.general.sound.skinOn,
        off: Koji.config.general.sound.skinOff
    },
    sound:{
        background: Koji.config.general.sound.background,
        die: Koji.config.general.sound.die,
        lifewin: Koji.config.general.sound.lifeWin,
        lifelose: Koji.config.general.sound.lifeLose,
        win: Koji.config.general.sound.win,
        lose: Koji.config.general.sound.lose,
    },

    //plaform
    sensitivity: Koji.config.platform.sensitivity,
    platform: {
        image:  toBlob(Koji.config.platform.platform.image),
        frame: Koji.config.platform.platform.frame,
        animation: {start: Koji.config.platform.platform.animations[0].start, end: Koji.config.platform.platform.animations[0].end, frameRate: Koji.config.platform.platform.animations[0].frameRate}
    },
    platformBackGround: {
        image:  toBlob(Koji.config.platform.platformBackGround.image),
        frame: Koji.config.platform.platformBackGround.frame,
        animation: {start: Koji.config.platform.platformBackGround.animations[0].start, end: Koji.config.platform.platformBackGround.animations[0].end, frameRate: Koji.config.platform.platformBackGround.animations[0].frameRate}
    },
    platformForeGround: {
        image:  toBlob(Koji.config.platform.platformForeGround.image),
        frame: Koji.config.platform.platformForeGround.frame,
        animation: {start: Koji.config.platform.platformForeGround.animations[0].start, end: Koji.config.platform.platformForeGround.animations[0].end, frameRate: Koji.config.platform.platformForeGround.animations[0].frameRate}
    },

    //player
    player: {
        image: toBlob(Koji.config.player.skin.image),
        frame: Koji.config.player.skin.frame,
        animation: {
            idl: Object.assign({repeat: -1}, Koji.config.player.skin.animations[getIndex('idl')]),
            die: Object.assign({repeat: -1}, Koji.config.player.skin.animations[getIndex('die')]),
            lifewin: Object.assign({repeat: 0}, Koji.config.player.skin.animations[getIndex('lifewin')]),
            win: Object.assign({repeat: 0}, Koji.config.player.skin.animations[getIndex('win')]),
            lose: Object.assign({repeat: 0}, Koji.config.player.skin.animations[getIndex('lose')]),
            lifelose: Object.assign({repeat: 0}, Koji.config.player.skin.animations[getIndex('lifelose')]),
        }
    },
    lifes: Koji.config.player.life,
    invincibilityTime: Koji.config.player.invincibilityTime,

    //grid
    acelleration: Koji.config.grid.acelleration,
    startSpeed: Koji.config.grid.startSpeed,
    gridDistance: Koji.config.grid.distance,
    grid: null,
}

console.log(window.Data.player)
function getIndex(key){
    let e = 0;
    for(let i = 0; i < Koji.config.player.skin.animations.length; i++){
        if(Koji.config.player.skin.animations[i].name == key) e = i;
    }

    return e;
}

WebFont.load({
    google: {
      families: [window.Data.fontFamily]
    },
    active: Check(Koji.config.grid.grids, Koji.config.grid.sprites, r => {
        window.Data.grid = r;
        window.Game = new Phaser.Game({
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '0x'+window.Data.color.primary.replace('#', ''),
            scene: [new Scene([ Load, Sounds, BackgroundParallax, Platform, Player, Grid, Score, Home, MiniScore, Tutorial, Leaderboard ])],
            scale: {
                parent: 'phaser-game',
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: "matter",
                matter: {
                    debug: true,
                    gravity: {x: 0, y: 7}
                }
            },
            loader: {crossOrigin: 'anonymous'},
            input :{
                activePointers:3,
            },
            autoRound: true,
            pixelArt: false
        })
    }),
});

render(
    <>
        <App/>
    </>,
    document.getElementById('root')
);

function toBlob(dataurl){
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return URL.createObjectURL(new Blob([u8arr], {type:mime}));
}