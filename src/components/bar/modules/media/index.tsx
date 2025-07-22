import { generateMediaLabel } from './helpers/index.js';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { NextTrack, PreviousTrack } from 'src/components/menus/media/components/controls/Tracks.js';
import { PlayPause } from 'src/components/menus/media/components/controls/PlayPause.js';
import { Gtk } from 'astal/gtk3';
import { Binding } from 'astal';
import { mediaArtUrl } from 'src/services/media';

import { BarBoxChild } from 'src/components/bar/types.js';
import { activePlayer, mediaTitle, mediaAlbum, mediaArtist } from 'src/services/media';
import options from 'src/configuration';
import { runAsyncCommand } from '../../utils/input/commandExecutor';
import { throttledScrollHandler } from '../../utils/input/throttle';
import { openDropdownMenu } from '../../utils/menu';

const mprisService = AstalMpris.get_default();
const {
    truncation,
    truncation_size,
    show_label,
    show_active_only,
    use_image_controls_mode,
    disable_media_label,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    format,
} = options.bar.media;

const isVis = Variable(!show_active_only.get());

Variable.derive([bind(show_active_only), bind(mprisService, 'players')], (showActive, players) => {
    isVis.set(!showActive || players?.length > 0);
});

const MediaImage = (): Astal.Box => {
    const getBackground = (): Binding<string> => {
        return Variable.derive([bind(mediaArtUrl)], (artUrl) => {
            return `background-image: url('${artUrl}');`;
        })();
    };
    return <box className="media-image" css={getBackground()} halign={Gtk.Align.CENTER} hexpand vertical />;
};

const Media = (): BarBoxChild => {
    activePlayer.set(mprisService.get_players()[0]);

    const songIcon = Variable('');

    const mediaLabel = Variable.derive(
        [
            bind(activePlayer),
            bind(truncation),
            bind(truncation_size),
            bind(show_label),
            bind(format),
            bind(mediaTitle),
            bind(mediaAlbum),
            bind(mediaArtist),
        ],
        () => {
            return generateMediaLabel(truncation_size, show_label, format, songIcon, activePlayer);
        },
    );

    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, show_label],
        (style: string) => {
            const styleMap: Record<string, string> = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `media-container ${styleMap[style]}`;
        },
    );

    const component = (
        <box
            className={componentClassName()}
            onDestroy={() => {
                songIcon.drop();
                mediaLabel.drop();
                componentClassName.drop();
            }}
        >
            {/* My custom media indicatior */}
            <box
                visible={bind(use_image_controls_mode).as((useImageControlsMode) => useImageControlsMode)}
                className={'media-indicator-current-player'}
            >
                <MediaImage />
                <box className={'media-indicator-current-controls'} halign={Gtk.Align.CENTER}>
                    <PreviousTrack />
                    <PlayPause />
                    <NextTrack />
                </box>
            </box>
            {/* Old media indicator */}
            <label
                className={'bar-button-icon media txt-icon bar'}
                label={bind(songIcon).as((icn) => icn || '󰝚')}
                visible={bind(use_image_controls_mode).as((useImageControlsMode) => !useImageControlsMode)}
            />
            <label
                className={'bar-button-label media'}
                label={mediaLabel()}
                visible={bind(
                    Variable.derive(
                        [bind(use_image_controls_mode), bind(disable_media_label)],
                        (useImageControlsMode, disableMediaLabel) =>
                            !useImageControlsMode || !disableMediaLabel,
                    ),
                )}
            />
        </box>
    );

    return {
        component,
        isVis: bind(isVis),
        isBox: true,
        boxClass: 'media',
        props: {
            tooltipText: bind(mediaLabel),
            setup: (self: Astal.Box): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        // NOTE: As part of my "controls experiment," I decided to remove the primary click handler
                        // as it causes problems when clicked on the buttons.
                        //
                        // disconnectFunctions.push(
                        // 	onPrimaryClick(self, (clicked, event) => {
                        // 		openDropdownMenu(clicked, event, 'mediamenu');
                        // 	}),
                        // );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()),
                        );
                    },
                );
            },
        },
    };
};

export { Media };
