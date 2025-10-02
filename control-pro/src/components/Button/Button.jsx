import classes from './Button.module.css'

export default function Button({children, isActive, isValid,...props}){
    //let classes = 'but'

    //if(isActive) classes += ' active'

    //<button className={classes}

    console.log(classes)
    return( <button className={isActive? `${classes.but} ${classes.active}`  : classes.but} /*можно в className добавить active "but active"*/ 
        {...props}
        onDoubleClick={() => console.log('Стрелка')}> 
        {children}
        </button>
    )


}


