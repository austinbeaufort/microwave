import { glass, panelDisplay, panel } from './models/display-items';
import { insert } from 'ramda';
import sounds from './microwave-sounds';

type Status = "showingClock" | "settingTimer" | "cooking" | 'done';



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
    }

    clear(): void
    {
        sounds.buttonPress.play()
        sounds.running.stop()
        sounds.end.stop()
        this.setStatus("showingClock");
        this.clearCookTime();
        this.toggleGlass();
        this.showClock();
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
                const displayDate: string = formatDate();
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


function formatDate(): string
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
    return displayDate;
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


const microwave = new Microwave();

export default microwave;