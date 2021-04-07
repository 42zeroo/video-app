import React, {useState, useContext, useEffect} from 'react'
import {useList, useSetList,useSortList, useDeleteListItem, useLoading} from '../../hooks/ListProvider'
import MovieListTable from './MovieListTable'
import MovieListTiles from './MovieListTiles'
import { Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import YouTube from 'react-youtube';
import {pagesCount} from '../../hooks/usePagination'
import Pager from './Pager'

const MovieListFunctionsContext = React.createContext();
export const useMovieListFunctions = () => useContext(MovieListFunctionsContext);

const MoviesList = ({favorites}) => {
  const [loading] = useLoading();

  const setList = useSetList();
  const list = useList();

  const [listDisplayMode, setListDisplayMode] = useState("tiles")

  const sortList = useSortList();
  const [sortType, setSortType] = useState("NEWEST_ASC");
  useEffect(() => {
    setList(sortList(sortType))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]) 

  const deleteItemFromList = useDeleteListItem();

  const [modal, setModal] = useState(false);
  const [modalVideo, setModalVideo] = useState('');

  const toogleFavorite = (movie) => {
    let muuid = movie.uuid;
    const newList = [...list];
    newList.find(m => m.uuid === muuid).favorite = !newList.find(m => m.uuid === muuid).favorite;
    setList(newList);
  }
  const tooglePlayMovie = (movie) => {
    setModal(!modal)
    setModalVideo(movie)
  }

  const makeNiceDateFormat = (date) => {
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${day}/${month}/${year} o ${hour}:${minutes}`
  }

    return (<>
    {!loading ? <>
      <Input
          style={{float:"right"}}
          onChange={e => setSortType(e.target.value)}
          className="col-md-3"
          type="select"
          name="select"
          id="exampleSelect"
        >
          <option value="NEWEST_ASC">Najnowsze</option>
          <option value="NEWEST_DESC">Najstarsze</option>
          <option value="ALFABETICAL_ASC">Alfabetycznie rosnaco</option>
          <option value="ALFABETICAL_DESC">Alfabetycznie malejaco</option>
        </Input>
      <div>
    <Button style={{float: 'left'}} onClick={()=>setListDisplayMode(listDisplayMode==="tiles" ? "table" : "tiles")} >
      {listDisplayMode === 'table' ? "Zmien sposob wyswietlania na kafelki" : "Zmien sposob wyswietlania na tabelke"}
    </Button>
    </div><hr /><br /><br />
    <MovieListFunctionsContext.Provider value={[tooglePlayMovie, makeNiceDateFormat,toogleFavorite,deleteItemFromList]}>
      <Pager pagesCount={pagesCount(favorites ? list.filter(movie => movie.favorite === true) : list)}/>
      {listDisplayMode === 'table' ? 
        <MovieListTable favorites={favorites} />
        :
        <MovieListTiles favorites={favorites}/>  
      }
      <Pager pagesCount={pagesCount(favorites ? list.filter(movie => movie.favorite === true) : list)}/>
    </MovieListFunctionsContext.Provider>
    

    <Modal isOpen={modal} fade={false} toggle={tooglePlayMovie}>
        <ModalHeader toggle={tooglePlayMovie}>{modalVideo.videoTitle}</ModalHeader>
        <ModalBody>
        {modalVideo.site === 'youtube' ? 
        <YouTube videoId={modalVideo.movieId}  opts={{
            width: '100%',
            playerVars: {
              autoplay: 1,
            },
          }} /> 
          :
          <>
          <iframe 
            src={`https://player.vimeo.com/video/${modalVideo.movieId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=210799`} 
            width="100%" 
            height="270px"
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen
            title={modalVideo.videoTitle}
          />
          </>
           }
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={tooglePlayMovie}>Zamknij okno</Button>
        </ModalFooter>
      </Modal>
     </> : <>
     <center>
       <h2>🔄 TRWA ŁADOWANIE DANYCH 🔄</h2>
       <p>Prosze czekac...</p>
      </center>
     </>}
    
    </>
    )
}

export default MoviesList
