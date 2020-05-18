import { head, takeLast } from 'ramda';


function getTimer()
{
    const timeNow: number = Date.now();
    const timeFuture: number = getMS("334") + timeNow;
}

function getMS(str: string): number
{
    const num = parseInt(str);
    const numIsSeconds = num < 99;
    if (numIsSeconds)
    {
        const ms = num * 1000;
        return ms;
    }
    else
    {
        const seconds = getSeconds(str);
        const ms = seconds * 1000;
        return ms;
    }
}

function getSeconds(str: string): number
{
    const seconds = parseInt(takeLast(2, str));
    const minutes = parseInt(head(str));
    const minAsSecs = minutes * 60;
    const totalSeconds = seconds + minAsSecs;
    return totalSeconds;
}

getTimer();