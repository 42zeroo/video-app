import React from 'react'
import SiteNavbar from './SiteNavbar'
import AddMovieField from './AddMovieField'
import MoviesList from './MovieList/MoviesList'
import ListProvider from '../hooks/ListProvider'
import { 
  Container,
  Row,
  Col,
 } from 'reactstrap';
 import {
  BrowserRouter as Router,
  Switch,
  Route,                  
} from "react-router-dom";

function App() {
  return (
    <Router>
      <ListProvider>
        <SiteNavbar />
        <Container fluid={true}>
          <Row>
            <Col className="mx-auto mt-2" sm={10}>
              <AddMovieField />
            </Col>
          </Row>
          <Row>
            <Col>
              <Switch>
                  <Route exact path="/">
                    <MoviesList />
                  </Route>
                  <Route path="/favorites">
                    <MoviesList favorites />
                  </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </ListProvider>
    </Router>
  );
}

export default App;
