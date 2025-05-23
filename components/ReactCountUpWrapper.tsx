"use client";
import React from 'react'
import CountUp from "react-countup"

export default function ReactCountUpWrapper({ value }: { value: number }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return "-";
    return <CountUp duration={0.5} preserveValue end={value} decimals={0}/>;
}