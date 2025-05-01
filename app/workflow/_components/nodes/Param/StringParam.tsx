"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/task';
import React, { useEffect, useId } from 'react'

function StringParam({param,value, updateNodeParamValue, disabled}: ParamProps) {
    const [internalValue, setIntervalValue] = React.useState(value);
    const id = useId();

    useEffect(() => {
      setIntervalValue(value);
    }, [value]);

    let Component:any = Input;
    if(param.variant === 'textarea') {
        Component = Textarea;
    }

  return (
    <div className='space-y-1 p-1 w-full '>
        <Label htmlFor={id} className='text-sx flex'>
            {param.name}
            {param.required && <span className='text-red-400 px-2'>*</span>}
        </Label>
        <Component disabled={disabled} id={id} value={internalValue} placeholder='Enter value here' onChange={(e : any) => {setIntervalValue(e.target.value)}} onBlur={(e:any) => updateNodeParamValue(e.target.value)} className='text-xs'/>
        {param.helperText && (
            <p className='text-muted-foreground px-2'>{param.helperText}</p>
        )}
    </div>
  )
}

export default StringParam