import { opt } from 'src/lib/options';

export default {
    format: opt('{artist: - }{title}'),
    truncation: opt(true),
    show_label: opt(true),
    truncation_size: opt(30),
    show_active_only: opt(false),
    use_image_controls_mode: opt(true),
    disable_media_label: opt(false), // used only if `use_image_controls_mode` is true
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
