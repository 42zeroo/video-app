import {useState} from 'react';
import {useResetList, useLoading, useSetList, useCurrentPage,useUpdateList} from '../hooks/ListProvider'
import {YoutubeLinks, VimeoLinks, MixedLinks} from '../data/SampleLinkList'
import DescribingVideo from '../data/DescribingVideo'

import { 
    Tooltip,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink,
    Button,
    DropdownItem,
    DropdownMenu,
    Dropdown,
    DropdownToggle,
   } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';


const SiteNavbar = () => {
    const updateList = useUpdateList();
    const [loading, setLoading] = useLoading();

    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpen = () => setIsOpen(!isOpen);
    
    const [tooltipUpdateOpen, setTooltipUpdateOpen] = useState(false);
    const [tooltipRemoveOpen, setTooltipRemoveOpen] = useState(false);
    const toggleTooltipRemove = () => setTooltipRemoveOpen(!tooltipRemoveOpen);
    const toggleTooltipUpdate = () => setTooltipUpdateOpen(!tooltipUpdateOpen);
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(!dropdownOpen);

    const toggleResetList = useResetList();

    const setList = useSetList();
    
    const [currentPage, setCurrentPage] = useCurrentPage(); 

    const toogleAddHardcodedList = async (linkList) => {
      if(!loading) setLoading(true)
      const movieObjects = await DescribingVideo.ListFromLinks(linkList)
      for(const obj in movieObjects) DescribingVideo.AddVideoToLocalStorageList(obj)
      setList(movieObjects)
      setLoading(false)
    }

    return (
    <Navbar color="light" light expand="md">
      <NavbarBrand to="/" onClick={()=>setCurrentPage(1)} tag={RRNavLink}>Video-App</NavbarBrand>
      <NavbarToggler onClick={toggleIsOpen} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink to="/favorites/" onClick={()=>setCurrentPage(1)} activeClassName="active" tag={RRNavLink}>
              Ulubione ⭐
            </NavLink>
          </NavItem>
        </Nav>
        <Dropdown  isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle nav caret >
            📄Playlisty   
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header key={currentPage}>Wybierz liste do wprowadzenia</DropdownItem>
            <DropdownItem onClick={() => toogleAddHardcodedList(YoutubeLinks)}>YouTube</DropdownItem>
            <DropdownItem onClick={() => toogleAddHardcodedList(VimeoLinks)} >Vimeo</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => toogleAddHardcodedList(MixedLinks)} >Mix</DropdownItem>
        </DropdownMenu>
        </Dropdown>
        <Button id="tooltipRefresh" style={{marginLeft: "2px"}} onClick={()=>updateList()} >
          ♻
          <Tooltip placement="bottom" isOpen={tooltipUpdateOpen} target="tooltipRefresh" toggle={toggleTooltipUpdate}>
            Odśwież dane
          </Tooltip>
        </Button>
        <Button id="tooltipRemove" style={{marginLeft: "2px"}} onClick={toggleResetList}>
          🗑️
          <Tooltip placement="bottom" isOpen={tooltipRemoveOpen} target="tooltipRemove" toggle={toggleTooltipRemove}>
            Usuń liste
          </Tooltip>
        </Button>
      </Collapse>
    </Navbar>
    )
}

export default SiteNavbar;