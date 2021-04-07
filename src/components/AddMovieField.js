
import React, {useState} from 'react'
import useWindowDimensions from '../hooks/useWindowsDeminsions'
import {useAddListItem} from '../hooks/ListProvider'
import DescribingVideo from '../data/DescribingVideo'


import {  InputGroup,
    InputGroupAddon,
    Input,
    FormGroup,
    Label,
    Button,
} from 'reactstrap';



const AddMovieField = () => {
    const addListItem = useAddListItem();
    const [inputValue, setInputValue] = useState("");
    const windowDimensions = useWindowDimensions();
    
    const handleOnClick = async (url) => {
        let fetchedData = await DescribingVideo.FetchVideoData(url);
        let data = DescribingVideo.MakeVideoObject(fetchedData)
        addListItem(data);
    }

    return (
        <FormGroup>
            <Label for="exampleEmail">Dodaj film</Label>
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    {windowDimensions.width >= 768 ? "Link do filmiku" : "Link"}
                </InputGroupAddon>
                <Input onChange={e => setInputValue(e.target.value)} placeholder="Podaj link lub id filmu z YouTube lub Vimeo" type="text" />
                <InputGroupAddon addonType="append">
                <Button onClick={() => handleOnClick(inputValue)} color="primary">
                    {windowDimensions.width >= 768 ? "↪Dodaj film do listy" : "↪"}
                </Button>{' '}
                </InputGroupAddon>
            </InputGroup>
        </FormGroup>
    )
}

export default AddMovieField
