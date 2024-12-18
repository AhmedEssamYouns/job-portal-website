import React from 'react';
import '../style/RobotLoader.css'; 
import { useTheme } from '@mui/material';


const RobotLoader = () => {
    const theme = useTheme()
    return (
        <div className="loader2">
            <div className="modelViewPort" style={{ backgroundColor: theme.palette.mode == 'dark' ? '#000':'#44449b'}}>
                <div className="eva">
                    <div className="head">
                        <div className="eyeChamber">
                            <div className="eye"></div>
                            <div className="eye"></div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="hand"></div>
                        <div className="hand"></div>
                        <div className="scannerThing"></div>
                        <div className="scannerOrigin"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RobotLoader;
