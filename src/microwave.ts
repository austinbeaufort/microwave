import showTime from './get-time';
import { glass, panelDisplay, panel } from './models/display-items';
import { insert, takeLast, min } from 'ramda';
import sounds from './microwave-sounds';

type Status = "showingClock" | "settingTimer" | "cooking" | 'done';
type PanelButton = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'clear-off' |
                     '7' | '8' | '9' | 'add-30' | 'time-cook' | 'start';


class Microwave {
    #status: Status;
    #cookTime: string;
    #cookId: any;

    constructor()
    {
        this.showClock()
        this.#status = "showingClock";
        this.#cookTime = "";
        this.#cookId = 0;
        console.log(sounds)

    }

    setStatus(newStatus: Status)
    {
        this.#status = newStatus;
    }

    getStatus(): string
    {
        return this.#status;
    }

    setCookTime(digit: string)
    {
        this.#cookTime = `${this.#cookTime}${digit}`;
    }

    setExpressTime(time: number): void
    {

        this.#cookTime = (time * 60).toString();
    }

    getCookTime(): string
    {
        return this.#cookTime;
    }

    clearCookTime(): void
    {
        clearInterval(this.#cookId);
        this.#cookTime = '';
    }

    toggleGlass(): void
    {
        if (this.#status === 'cooking')
        {
            glass.classList.add('glass-mic-on');
        }
        else
        {
            glass.classList.remove('glass-mic-on');
        }
    }

    displayCookTime(): void
    {
        const timeArray: Array<String> = this.#cookTime.split('');
        let insertPlace: number;
        const cookString: string = formatCookTime(timeArray, insertPlace, this.#cookTime);
        panelDisplay.innerHTML = cookString;

    }

    showClock(): void
    {
        const intervalId = setInterval(() => 
        {
            if (this.#status !== 'showingClock')
            {
                clearInterval(intervalId);
            }
            else
            {
                const today: Date = new Date();
                let hours = today.getHours();
                let ampm: string;
                if (hours >= 12)
                {
                    ampm = 'PM';
                }
                else
                {
                    ampm = 'AM';
                }
                const isMidnight: boolean = hours % 12 === 0;
                if (isMidnight)
                {
                    hours = 0;
                }
                else
                {
                    hours = hours % 12;
                }
                const displayDate: string = `${format(hours)}:${format(today.getMinutes())}:${format(today.getSeconds())}${ampm}`;
                panelDisplay.innerHTML = displayDate;
            }
        }, 100);
    }

    runTimer(isExpress: boolean): void
    {
        this.setStatus("cooking");
        this.toggleGlass()
        let cookSeconds: number;
        sounds.start.play()
        setTimeout(() => sounds.running.play(), 1500);
        let displaySeconds: string = this.#cookTime;
        if (this.#cookTime.length > 2)
        {
            cookSeconds = getSeconds(this.#cookTime, isExpress);
        }
        else
        {
            cookSeconds = parseInt(this.#cookTime);
        }

        panelDisplay.innerHTML = cookTimeAsMinutes(cookSeconds);
        if (parseInt(displaySeconds) <= 99)
        {
            this.#cookId = setInterval(() =>
            {
                cookSeconds--;
                panelDisplay.innerHTML = `00:${format(cookSeconds)}`;
                if (cookSeconds === 0)
                {
                    clearInterval(this.#cookId)
                    sounds.running.stop()
                    sounds.end.play()
                    this.#status = 'done';
                    this.toggleGlass()
                }
            }, 1000);
        }
        else
        {
            this.#cookId = setInterval(() =>
            {
                cookSeconds--;
                const displayTime: string = cookTimeAsMinutes(cookSeconds);
                panelDisplay.innerHTML = displayTime;
                if (cookSeconds === 0)
                {
                    clearInterval(this.#cookId)
                    sounds.running.stop()
                    this.#status = 'done';
                    this.toggleGlass()
                }
            }, 1000);
        }
    }
}


function getSeconds(cookTime: string, isExpress: boolean): number
{
    let seconds: number;
    let minutes: number;
    switch (true)
    {
        case cookTime === '180' && isExpress:
            return 180;
        case cookTime === '120' && isExpress:
            return 120;
        case cookTime.length === 3:
            seconds = parseInt(cookTime.slice(1));
            minutes = parseInt(cookTime.slice(0, 1));
            break;
        default:
            seconds = parseInt(cookTime.slice(2));
            minutes = parseInt(cookTime.slice(0, 2));
            break;
    }
    const totalSeconds: number = (minutes * 60) + seconds;
    return totalSeconds;
}


function cookTimeAsMinutes(cookSeconds: number): string
{
    const minutes: number = Math.floor(cookSeconds / 60);
    const seconds: number = cookSeconds - (minutes * 60);
    const displayTime: string = `${format(minutes)}:${format(seconds)}`;
    return displayTime;
}


function main(): void
{
    const microwave = new Microwave();
    panel.addEventListener('click', changeStatus.bind(null, microwave));
}

main();


function changeStatus(microwave, e): void
{
    const buttonPressed: PanelButton = e.target.id;
    switch (buttonPressed)
    {
        case "time-cook":
            sounds.buttonPress.play()
            microwave.setStatus("settingTimer");
            panelDisplay.innerHTML = 'TIME';
            microwave.clearCookTime();
            break;
        case "clear-off":
            sounds.buttonPress.play()
            sounds.running.stop()
            sounds.end.stop()
            microwave.setStatus("showingClock");
            microwave.clearCookTime();
            microwave.toggleGlass();
            microwave.showClock();
            break;
        case "start":
            const cookTimer: string = microwave.getCookTime();
            if (microwave.getStatus() !== "settingTimer" || cookTimer.length === 0)
            {
                return;
            }
            else
            {
                const isExpress: boolean = false;
                microwave.runTimer(isExpress);
            }
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (( buttonPressed === '1' 
             || buttonPressed === '2' 
             || buttonPressed === '3') 
             && microwave.getStatus() === 'showingClock')
            {
                microwave.setExpressTime(parseInt(buttonPressed));
                const isExpress: boolean = true;
                microwave.runTimer(isExpress);
            }
            const cookTime: string = microwave.getCookTime();
            if (cookTime.length === 4 || microwave.getStatus() !== "settingTimer")
            {
                return;
            }
            else
            {
                sounds.buttonPress.play()
                microwave.setStatus("settingTimer");
                microwave.setCookTime(buttonPressed);
                microwave.displayCookTime();
            }
            break;
        default:
            return;

    }
}


function formatCookTime(timeArray: Array<String>, insertPlace: number, currentTime: string): string
{
    switch(currentTime.length)
    {
        case 3:
            insertPlace = 1;
            break;
        case 4:
            insertPlace = 2;
            break;
        default:
            return currentTime;

    }

    if (currentTime.length > 2)
    {
        const cookTime: Array<String> = insert(insertPlace, ':', timeArray);
        const cookString: string = cookTime.join('');
        return cookString;
    }
}


function format(time: number): string
{
    let formattedTime: string;
    if (time <= 9)
    {
        formattedTime = `0${time}`;
    }
    else
    {
        formattedTime = time.toString();
    }
    return formattedTime;
}
