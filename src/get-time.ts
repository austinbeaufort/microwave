import { panelDisplay } from './models/display-items';



function showTime()
{
    setInterval(() => 
    {
        const today: Date = new Date();
        const displayDate: string = `${format(today.getHours())}:${format(today.getMinutes())}:${format(today.getSeconds())}`;
        panelDisplay.innerHTML = displayDate;
    }, 1000);
    
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

export default showTime;