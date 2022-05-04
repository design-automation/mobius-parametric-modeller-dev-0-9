# rm -r node_modules/@design-automation

if ! cd src/design-automation;
then
    mkdir src/design-automation;
    cd src/design-automation;
fi

if [[ -f "mobius-sim/package.json" ]]
then cd mobius-sim; git pull; cd ..;
else git submodule add https://github.com/design-automation/mobius-sim.git ./src/mobius-sim;
fi

if [[ -f "mobius-sim-funcs/package.json" ]];
then cd mobius-sim-funcs; git pull; cd ..;
else git submodule add https://github.com/design-automation/mobius-sim-funcs.git ./src/mobius-sim-funcs;
fi

if [[ -f "mobius-inline-funcs/package.json" ]];
then cd mobius-inline-funcs; git pull; cd ..;
else git submodule add https://github.com/design-automation/mobius-inline-funcs.git ./src/mobius-inline-funcs;
fi
