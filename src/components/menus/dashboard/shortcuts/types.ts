import { Variable } from 'astal';

export type ShortcutVariable = {
    tooltip: Variable<string>;
    leftClick: Variable<string>;
    rightClick: Variable<string>;
    middleClick: Variable<string>;
    icon: Variable<string>;
    configurable?: true;
};
