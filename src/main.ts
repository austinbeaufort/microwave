import sounds from './microwave-sounds';
import { glass, panelDisplay, panel } from './models/display-items';
import microwave from './microwave';


type PanelButton = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'clear-off' |
                     '7' | '8' | '9' | 'add-30' | 'time-cook' | 'start';

function main(): void
{
    console.log(microwave);
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
