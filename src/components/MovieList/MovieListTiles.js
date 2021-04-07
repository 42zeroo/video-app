import React from 'react'
import {useList} from './../../hooks/ListProvider'
import {useMovieListFunctions} from './MoviesList'
import {Container,Col, Row,Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button} from 'reactstrap'
import { useCurrentPage} from '../../hooks/ListProvider'
import {cutListPerPage} from '../../hooks/usePagination'
import useWindowDimensions from './../../hooks/useWindowsDeminsions'

const MovieListTiles = ({favorites}) => {
    const list = useList();
    const windowDimensions = useWindowDimensions();
    const [
        tooglePlayMovie,
        makeNiceDateFormat,
        toogleFavorite,
        deleteItemFromList,
      ] = useMovieListFunctions();
      const [
        currentPage,
      ] = useCurrentPage();
    
  
    const CardWithDiscribedVideoInfo = (movie) =>{
        const movieTitle = movie.videoTitle.length > 100 ? movie.videoTitle+"..." : movie.videoTitle;
        const movieAlt = movie.id+"thumbnail"
        return (
        <Card key={movie.uuid} className=" mx-auto mb-4" style={windowDimensions.width < 768? {height: "100%",width: "90vw"} : {height: "100%", width : "23rem"}}>    
            <CardImg top height="250vh"  alt={movieAlt} src={movie.thumbnail} onClick={() => tooglePlayMovie(movie)} />
            <Button color="transparent" style={{position:"absolute", right: 0}} onClick={()=>deleteItemFromList(movie)}>❌</Button>
            <CardBody>
                <CardTitle tag="h5">
                    <Row>
                        <Col style={{fontSize: movie.videoTitle.length > 50 ? "1rem":"1.3rem"}}>
                            {movieTitle}
                        </Col>
                        <Col sm={2}>
                            <Button color="light" style={{float: "right"}} onClick={() => {toogleFavorite(movie)}}>
                                {movie.favorite ? "⭐" : "★"}
                            </Button>
                        </Col>    
                    </Row>
                </CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                    Data dodania: {makeNiceDateFormat(new Date(movie.uploadDate))}
                </CardSubtitle>
                <Row>
                    <Col>
                        👍: {movie.likes}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        👀: {movie.plays}
                    </Col>
                    <Col>
                        <Button  style={{float: "right"}} color="light" 
                            onClick={() => tooglePlayMovie(movie)}>▶
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card> 
    )}

    return (
        <Container fluid>
        <br />
        <Row>
        {favorites ? 
                cutListPerPage(list, currentPage, 10, true)?.map(movie => CardWithDiscribedVideoInfo(movie))
                :
                cutListPerPage(list,currentPage, 10).map(movie => CardWithDiscribedVideoInfo(movie))
                }
        </Row>
        </Container>
    )
}

export default MovieListTiles
