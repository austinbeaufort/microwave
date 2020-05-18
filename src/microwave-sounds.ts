import { Howl } from 'howler';
const rawSounds = require('./sounds/*.mp3');

const start = new Howl(
    {
        src: [rawSounds.start]
    }
);

const end = new Howl(
    {
        src: [rawSounds.end]
    }
);

const buttonPress = new Howl(
    {
        src: [rawSounds['push-button']]
    }
);

const running = new Howl(
    {
        src: [rawSounds.running]
    }
);

export default {
    start,
    end,
    buttonPress,
    running,
}