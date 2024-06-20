import React from 'react';
// MUI Icons
import WhereToVoteRoundedIcon from '@mui/icons-material/WhereToVoteRounded';
import WifiIcon from '@mui/icons-material/Wifi';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const AmenityIcon = ({ amenity }) => {
    const icons = {
        wifi: <WifiIcon fontSize='medium' />,
        cooler: <AcUnitIcon fontSize='medium' />,
        kitchen: <KitchenIcon fontSize='medium' />,
        parking: <LocalParkingIcon fontSize='medium' />,
        pool: <PoolIcon fontSize='medium' />,
        default: <WhereToVoteRoundedIcon fontSize='medium' />,
    };
    return icons[amenity] || icons.default;
};

export default AmenityIcon;