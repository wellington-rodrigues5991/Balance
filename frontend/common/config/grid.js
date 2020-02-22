window.Grid = {
    value: 0,
    old: 0,
    calculate: () => {
        window.Grid.old = window.Grid.value;
        window.Grid.value = window.innerWidth/10
    }
};

window.Grid.calculate();
window.addEventListener('resize', window.Grid.calculate);