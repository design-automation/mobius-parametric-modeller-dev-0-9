# rm -r node_modules/@design-automation

if ! cd src/design-automation;
then
    mkdir src/design-automation;
    cd src/design-automation;
fi

if cd mobius-sim;
then git pull; cd ..;
else git clone https://github.com/design-automation/mobius-sim.git;
fi

if cd mobius-sim-funcs;
then git pull; cd ..;
else git clone https://github.com/design-automation/mobius-sim-funcs.git;
fi

if cd mobius-inline-funcs;
then git pull; cd ..;
else git clone https://github.com/design-automation/mobius-inline-funcs.git;
fi

