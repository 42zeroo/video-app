import { useState} from 'react'


export const cutListPerPage = (list, page, itemsPerPage, favorite=false) => favorite ? 
list?.filter(movie => movie.favorite === true)?.slice(0+((page-1)*itemsPerPage),itemsPerPage+((page-1)*itemsPerPage))
: list?.slice(0+((page-1)*itemsPerPage),itemsPerPage+((page-1)*itemsPerPage))

export const pagesCount = (list) => Math.ceil(list?.length / 10)


const usePagination = () => {

    const [currentPage, setCurrentPage] = useState(1);

    return [currentPage, setCurrentPage]
    
}

export default usePagination
