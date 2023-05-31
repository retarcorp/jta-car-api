const areIntervalsIntersected = (start: Date, end: Date, checkedStart: Date, checkedEnd: Date) => {
    
    const inInterval = (dp: Date) => (start.getTime() < dp.getTime()) && (end.getTime() > dp.getTime());
    const startIntersects = inInterval(checkedStart)
    const endIntersects = inInterval(checkedEnd);
    const isIncluded = (start.getTime() >= checkedStart.getTime()) && (end.getTime() <= checkedEnd.getTime());
    const isContainer = (start.getTime() <= checkedStart.getTime()) && (end.getTime() >= checkedEnd.getTime());

    const isOverlap = isIncluded || isContainer;

    return startIntersects || endIntersects || isOverlap;
}

export default areIntervalsIntersected;