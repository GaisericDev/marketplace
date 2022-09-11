import React from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import metamaskImg from "../../assets/mm.png";
import walletconnectImg from "../../assets/wc.png";

export const WalletSelect = (props) => {

  const handleClose = () => {
    props.setOpen(false);
  }
  
  return (
    <Modal
        open={props.open}
        onClose={handleClose}
    >
        <Box>
            <Button 
                variant="contained"
                size="large"
                onClick={() => {
                    activate(connectors.walletConnect);
                    setProvider("walletConnect");
                    handleClose();
            }}
        ><img src={walletconnectImg} alt="walletconnect"></img>Wallet Connect</Button>
        <Button 
                variant="contained"
                size="large"
                onClick={() => {
                    activate(connectors.injected);
                    setProvider("injected");
                    handleClose();
            }}
        ><img src={metamaskImg} alt="metamask"></img>Metamask</Button>
        </Box>
    </Modal>
  )
}
