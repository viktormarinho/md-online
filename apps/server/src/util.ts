export function dateWithExtraHours(hours: number) {
    const date = new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    return date;
}