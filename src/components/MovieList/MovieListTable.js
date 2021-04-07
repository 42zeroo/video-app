import React from 'react'
import {useList} from './../../hooks/ListProvider'
import {useMovieListFunctions} from './MoviesList'
import {Table} from 'reactstrap'
import { useCurrentPage} from '../../hooks/ListProvider'
import {cutListPerPage} from '../../hooks/usePagination'


const MovieListTable = ({favorites}) => {
  const [
    tooglePlayMovie,
    makeNiceDateFormat,
    toogleFavorite,
    deleteItemFromList,
  ] = useMovieListFunctions();
  const [
    currentPage,
  ] = useCurrentPage();

    const list = useList();
   
    const TableRowWithDiscribedVideoInfo = (movie) =>{
        const movieAlt = movie.id+"thumbnail"
        return <tr  key={movie.uuid}>
            <td style={{textAlign: "center"}}>
              <img alt={movieAlt} src={movie.thumbnail} height="60px" width="90px" onClick={() => tooglePlayMovie(movie)}/>
            </td>
            <td style={{ verticalAlign: "middle" }}>{movie.videoTitle}</td>
            <td style={{textAlign: "center",verticalAlign: "middle"}}>{movie.plays}</td>
            <td style={{textAlign: "center",verticalAlign: "middle"}}>{movie.likes}</td>
            <td style={{textAlign: "center",verticalAlign: "middle"}}>{makeNiceDateFormat(new Date(movie.uploadDate))}</td>
            <td style={{textAlign: "center",verticalAlign: "middle", fontSize: "1.3rem"}}><button onClick={() => {
                toogleFavorite(movie)
            }}>{movie.favorite ? "⭐" : "★"}</button></td>
            <td style={{fontSize: "1.3rem",textAlign: "center",verticalAlign: "middle",  }}>
                <div style={{display: "flex", }}>
                <button onClick={() => {
                  tooglePlayMovie(movie)
              }}>▶</button> <p className="mx-auto"></p> <button onClick={()=>deleteItemFromList(movie)}>❌</button>
                </div>
              
            </td>
        </tr> }

    return (
        <Table borderless responsive>
            <thead>
                <tr>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>Miniaturka</th>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>Nazwa</th>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>Odtworzenia</th>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>Polubienia</th>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>Data dodania</th>
                <th style={{textAlign: "center",verticalAlign: "middle"}}>ULUBIONE</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
              
                {favorites ? 
                cutListPerPage(list, currentPage, 10, true)?.map(movie => TableRowWithDiscribedVideoInfo(movie))
                :
                cutListPerPage(list,currentPage, 10).map(movie => TableRowWithDiscribedVideoInfo(movie))
                }
            </tbody>
        </Table>
    )
}

export default MovieListTable
