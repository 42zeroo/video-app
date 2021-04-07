import React from 'react'
import {Button} from 'reactstrap'
import { useCurrentPage} from '../../hooks/ListProvider'



const Pager = ({pagesCount}) => {
    const [
        currentPage,
        setCurrentPage
      ] = useCurrentPage();
    
    const Pagination = () => {
        const listOfPages = []
        for(let i=1; i<=pagesCount; i++)
            listOfPages.push(
            <li key={'page_'+i} style={{display: "inline",marginLeft: "10px",}}>
                {i===currentPage ? 
                    <div style={{color: "red",display: "inline"}}>
                        <Button  disabled>{i}</Button>
                    </div>
                    :
                    <Button onClick={() => setCurrentPage(i)}>{i}</Button>}
            </li>)
        return listOfPages
    }
    
    return (
        <ul style={{textAlign: "center"}}>
            <Pagination />
        </ul>
    )
}

export default Pager
