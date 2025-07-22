import { bind, Variable } from 'astal';
import { hasCommand, isRecording, leftCardHidden } from '../helpers';
import {
    LeftShortcut1,
    LeftShortcut2,
    LeftShortcut3,
    LeftShortcut4,
    RightShortcut1,
    RightShortcut3,
} from '../buttons/ShortcutButtons';
import { LeftColumn, RightColumn } from './Column';
import { SettingsButton } from '../buttons/SettingsButton';
import { RecordingButton } from '../buttons/RecordingButton';
import options from 'src/configuration';

const { left, right } = options.menus.dashboard.shortcuts;

const leftBindings = [
    bind(left.shortcut1.leftClick),
    bind(left.shortcut1.rightClick),
    bind(left.shortcut1.middleClick),
    bind(left.shortcut1.scrollUp),
    bind(left.shortcut1.scrollDown),
    bind(left.shortcut1.tooltip),
    bind(left.shortcut1.icon),

    bind(left.shortcut2.leftClick),
    bind(left.shortcut2.rightClick),
    bind(left.shortcut2.middleClick),
    bind(left.shortcut2.scrollUp),
    bind(left.shortcut2.scrollDown),
    bind(left.shortcut2.tooltip),
    bind(left.shortcut2.icon),

    bind(left.shortcut3.leftClick),
    bind(left.shortcut3.rightClick),
    bind(left.shortcut3.middleClick),
    bind(left.shortcut3.scrollUp),
    bind(left.shortcut3.scrollDown),
    bind(left.shortcut3.tooltip),
    bind(left.shortcut3.icon),

    bind(left.shortcut4.leftClick),
    bind(left.shortcut4.rightClick),
    bind(left.shortcut4.middleClick),
    bind(left.shortcut4.scrollUp),
    bind(left.shortcut4.scrollDown),
    bind(left.shortcut4.tooltip),
    bind(left.shortcut4.icon),
];

const rightBindings = [
    bind(right.shortcut1.leftClick),
    bind(right.shortcut1.rightClick),
    bind(right.shortcut1.middleClick),
    bind(right.shortcut1.scrollUp),
    bind(right.shortcut1.scrollDown),
    bind(right.shortcut1.tooltip),
    bind(right.shortcut1.icon),

    bind(right.shortcut3.leftClick),
    bind(right.shortcut3.rightClick),
    bind(right.shortcut3.middleClick),
    bind(right.shortcut3.scrollUp),
    bind(right.shortcut3.scrollDown),
    bind(right.shortcut3.tooltip),
    bind(right.shortcut3.icon),

    bind(leftCardHidden),
    bind(isRecording),
];

export const LeftShortcuts = (): JSX.Element => {
    return (
        <box>
            {Variable.derive(leftBindings, () => {
                const isVisibleLeft = hasCommand(left.shortcut1) || hasCommand(left.shortcut2);
                const isVisibleRight = hasCommand(left.shortcut3) || hasCommand(left.shortcut4);

                if (!isVisibleLeft && !isVisibleRight) {
                    leftCardHidden.set(true);
                    return <box />;
                }

                leftCardHidden.set(false);

                return (
                    <box className={'container most-used dashboard-card'}>
                        <LeftColumn isVisible={isVisibleRight && isVisibleLeft}>
                            <LeftShortcut1 />
                            <LeftShortcut2 />
                        </LeftColumn>
                        <RightColumn>
                            <LeftShortcut3 />
                            <LeftShortcut4 />
                        </RightColumn>
                    </box>
                );
            })()}
        </box>
    );
};

export const RightShortcuts = (): JSX.Element => {
    return (
        <box>
            {Variable.derive(rightBindings, () => {
                return (
                    <box
                        className={`container utilities dashboard-card ${!leftCardHidden.get() ? 'paired' : ''}`}
                    >
                        <LeftColumn isVisible={true}>
                            <RightShortcut1 />
                            <SettingsButton />
                        </LeftColumn>
                        <RightColumn>
                            <RightShortcut3 />
                            <RecordingButton />
                        </RightColumn>
                    </box>
                );
            })()}
        </box>
    );
};
