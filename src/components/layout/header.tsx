import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import ChainDropdown from "../wallet/chaindropdown.tsx";
import DropDown from './dropdown.tsx';
import ConnectWallet from "../wallet/connectwallet.tsx";
import DisconnectWallet from "../wallet/disconnectwallet.tsx";
import "../../App.css";
interface NetworkInfo {
  icon: string;
  name: string;
  chainId: string;
  nativeCurrency: {
    name: string;
    decimals: number;
    symbol: string;
  };
  rpcUrls: string;
}

interface SetInfoType {
  netInfoState: NetworkInfo;
  setNetInfoState: (netInfoState: NetworkInfo) => void;
  addrInfo: string;
  setAddrInfo: (addr: string) => void;
}

const navDropProps = [
  {
    label: "Prediction",
    menulist: ['Recent Prediction', 'Upcoming Prediction', 'Create Prediction']
  },
  {
    label: 'Trending Project',
    menulist: ['See all trending projects', 'Create Project'],
  },
  {
    label: 'Features',
    menulist: ['See all features', 'Create Feature'],
  },
  {
    label: 'How It Works',
    menulist: ['See Video', 'Create demo video'],
  }
]
// let selectedAccount: string;
// let web3Modal: Web3Modal;
function Header({
  addrInfo,
  setAddrInfo,
  netInfoState,
  setNetInfoState,
}: SetInfoType) {
  //
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [provider, setProvider] = React.useState<providers.Web3Provider | null>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const onNetworkChange = (netInfo: NetworkInfo) => {
    console.log(netInfo.chainId);
    switchNetwork(netInfo);
    setNetInfoState(netInfo);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSetting = () => {};

  const handleMessage = () => {};

  async function switchNetwork(netinfo: NetworkInfo) {
    if (window.ethereum.networkVersion !== netinfo.chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: netinfo.chainId }],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: netinfo.name,
                chainId: netinfo.chainId,
                nativeCurrency: netinfo.nativeCurrency,
                rpcUrls: netinfo.rpcUrls,
              },
            ],
          });
        }
      }
    }
  }
  React.useEffect(() => {
    connetWallet();
  });

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    // providerOptions,
    // disableInjectedProvider: false,
  });
  async function connetWallet() {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    const connection = await web3Modal.connect();
    // console.log(connection);

    const pv = new ethers.providers.Web3Provider(connection);
    setProvider(pv);
    const signer = pv.getSigner();
    const addr = await signer.getAddress();
    setAddrInfo(addr);
  }
  async function disconnectWallet() {
    console.log("Killing the wallet connection", provider);
    setAddrInfo("");
    setProvider(null);
  }

  return (
    <AppBar position="static" sx={{ background: "none", zIndex: "999" }}>
      <Container maxWidth="xl" className="items-center">
        <Toolbar disableGutters className="flex flex-row justify-between items-center my-4">
          <Box className='flex flex-row place-items-center'>
            <img src="/images/image 1356.png" alt="logo" className="logo" />
            <Box sx={{ display: { xs: "none", lg: "flex" } }}>
              {navDropProps.map((item) => (
                <DropDown label={item.label} key={item.label} menulist={item.menulist}/>
              ))}
            </Box>
          </Box>
          <Box
            className="flex flex-row items-center"
          >
            <Box
              className='flex flex-row my-auto'
            >
              <img
                onClick={handleSetting}
                style={{ cursor: "pointer" }}
                src="/icons/setting.svg"
              />
              <img
                onClick={handleMessage}
                style={{ marginLeft: "0.8rem", cursor: "pointer" }}
                src="/icons/message-notif.svg"
              />
              <ChainDropdown onNetworkChange={onNetworkChange} />
              {addrInfo ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      pl: "10px",
                      flexDirection: "column",
                      alignItems: "center",
                      display:{xs:'none', md:'flex'}
                    }}
                  >
                    <Typography>{netInfoState.name.slice(0, 3)}</Typography>
                    <Typography>
                      {addrInfo.slice(0, 6) + "..." + addrInfo.slice(-5)}
                    </Typography>
                  </Box>
                  <DisconnectWallet handleDisconnect={disconnectWallet} />
                </Box>
              ) : (
                <ConnectWallet handleConnect={connetWallet} />
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: { xs:'end', md:'none'}}}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                className="md:hidden"
              >
                {navDropProps.map((item) => (
                  <MenuItem key={item.label} onClick={handleCloseNavMenu}>
                    <Typography>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
