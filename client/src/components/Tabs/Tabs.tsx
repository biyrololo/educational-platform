import { Box, Button } from "@mui/material";
import { styled } from '@mui/system';
import React, {ReactElement, ReactNode, useRef, useState, CSSProperties} from 'react';

type ActiveElementRect = {
    x: number,
    y: number,
    width: number,
    height: number
};

const TabsBox = styled(Box)({
    display: 'flex',
    position: 'relative',
    flexWrap: 'wrap',
    gap: '1rem'
}),
ActiveCircle = styled(Box)({
    position: 'absolute',
    width: '15rem',
    height: '100%',
    background: '#DDD3EC',
    transition: 'all ease 0.5s',
    borderRadius: '20px'
})

type TabsProps = {
    children: ReactNode,
    style?: CSSProperties,
    circleStyle?: CSSProperties;
    mustOneChoose?: Boolean
}

type TabParams = {
    tab: number, 
    rect: {x: number, y: number, width: number, height: number}
}

function Tabs(props: TabsProps){

    // const [curTab, setCurTab] = useState(-1);

    // const [rect, setRect] = useState({x: 0, y: 0, width: 0, height: 0})

    const [params, setParams] = useState<TabParams>(
        {
            tab: -1,
            rect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    );

    return (
        <TabsBox 
            style={props.style}
        >
            <ActiveCircle sx={
                {
                    ...props.circleStyle,
                    left: `${params.rect.x}px`,
                    top: `${params.rect.y}px`,
                    width: `${params.rect.width}px`,
                    height: `${params.rect.height}px`
                }
            }/>
            {
                React.Children.map(
                    props.children,
                    (child, index) => {
                        return React.cloneElement(child as ReactElement<TabProps>, 
                            {
                                updateTab: setParams,
                                iTab: index,
                                curTab: params.tab,
                                mustOneChoose: props.mustOneChoose
                            }
                        )
                    }
                )
            }
        </TabsBox>
    )

}

type TabProps = {
    onClick?: (isActive: Boolean)=>void,
    updateTab?: (newParams: TabParams) => void,
    iTab?: number,
    disabled?: Boolean,
    border?: Boolean,
    curTab?: number,
    size?: 'medium' | 'small',
    children: ReactNode,
    style?: CSSProperties,
    variant?: 'contained' | 'outlined' | 'text',
    color?: "inherit" | "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined,
    hoverStyle?: CSSProperties,
    activeStyle?: CSSProperties,
    mustOneChoose?: Boolean
}

const TabBtn = styled(Button)({
    minWidth: '15rem',
    color: '#6220B7',
    fontWeight: 'bold',
    fontSize: '1rem'
}) 

function Tab(props: TabProps){

    const tabRef = useRef<HTMLButtonElement>(null);

    const handleClick = ()=>{
        if(!props.updateTab || props.iTab === undefined) return

        if(props.onClick)
            props.onClick(props.iTab === props.curTab);

        const element = tabRef.current;
        if(!element) return;

        let newTab = props.iTab;
        const rect = element.getBoundingClientRect();
    
        const parentElement = element.parentElement;
        if (!parentElement) return
        const parentRect = parentElement.getBoundingClientRect();
        
        const relativeX = rect.x - parentRect.x;
        const relativeY = rect.y - parentRect.y;

        let newRect = {x: relativeX, y: relativeY, width: rect.width, height: rect.height};

        if(props.curTab === props.iTab && !props.mustOneChoose){
            newTab = -1;
            newRect = {x: relativeX+rect.width/2, y: relativeY+rect.height/2, width: 0, height: 0};
        }
            
        props.updateTab({tab: newTab, rect: newRect});
    }

    return (
        <TabBtn onClick={handleClick} disabled={props.disabled?props.disabled.valueOf():false}
        ref={tabRef}
        sx={ 
            {
                ...
                props.size==='small'?{
                    fontSize: '.8rem',
                    fontWeight: 'normal',
                    minWidth: '10rem',
                    width: 'auto'
                }:{
                },
                ...props.style,
                '&:hover':{
                    ...props.hoverStyle
                },
                ...
                props.curTab === props.iTab? {
                    ...props.activeStyle
                } : 
                {}
            }
        }
        variant={props.variant || 'text'}
        color={props.color || 'secondary'}
        >
            {props.children}
        </TabBtn>
    )
}

export {Tab, Tabs};