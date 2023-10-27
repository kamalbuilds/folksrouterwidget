import React from 'react';
import SwapWidget from '../../components/Widget/SwapWidget';

const SwapPage = () => {
    return (
        <div className='p-8'>

            <div>Heading: This is from the client side.</div>

            <div> Below this everything is from the package:</div>
            <div className='h-[4px] w-[100%] bg-gray-600 rounded-lg'></div>
            <SwapWidget />
        </div>
    );
};

export default SwapPage;