import React, { useState, useContext } from "react";
import usePagination from './usePagination'
import DescribingVideo from './../data/DescribingVideo'

const ListContext = React.createContext();
const ListSetContext = React.createContext();
const ListContextUpdate = React.createContext();
const ListContextReset = React.createContext();
const ListContextSort = React.createContext();
const ListContextItemDelete = React.createContext();
const CurrentPageContext = React.createContext();
const ListUpdateContext = React.createContext();
const ListLoadingContext = React.createContext();

export const useList = () => useContext(ListContext);
export const useSetList = () => useContext(ListSetContext);
export const useAddListItem = () => useContext(ListContextUpdate);
export const useResetList = () => useContext(ListContextReset)
export const useSortList = () => useContext(ListContextSort)
export const useDeleteListItem = () => useContext(ListContextItemDelete)
export const useCurrentPage = () => useContext(CurrentPageContext)
export const useUpdateList = () => useContext(ListUpdateContext)
export const useLoading = () => useContext(ListLoadingContext)

const ListProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = usePagination();
  const [loading, setLoading] = useState(false)
  const [sortMethod, setSortMethod] = useState("NEWEST_ASC")

  const [list, setList] = useState( 
    JSON.parse(localStorage.getItem('movieList')) === [null] ? [] : JSON.parse(localStorage.getItem('movieList'))
  );
  const setListAndAddToLocalStorage = (val) => {
    setList(val);
    localStorage.setItem('movieList',  JSON.stringify(val));
  }
  const addListItem = (item) => {
    if(list?.length >= 0) {
      DescribingVideo.AddVideoToLocalStorageList(item)
      const sortedListWithNewItem = sortList(sortMethod, [...list, item])
      setList([...sortedListWithNewItem])
    }
  }

  const resetListItems = () => {
    setList([]);
    localStorage.setItem('movieList', "[]");
  }
  
  const updateList = async () => {
    setLoading(true);
    let ids=[],newList = []
    list.forEach(item=>
      ids.push(item.movieId))
    for(const link of ids){
      let fetchedData = await DescribingVideo.FetchVideoData(link);
      let obj =  DescribingVideo.MakeVideoObject(fetchedData)
      newList.push(obj)
    }
    setListAndAddToLocalStorage(newList)
    setLoading(false)

  }

  const sortList = (SORT = sortMethod, listToSort = list) => {
    if(list===null) return;
    let sortedList = [...listToSort];
    switch (SORT) {
      case "ALFABETICAL_ASC":
        sortedList = sortedList.sort((a, b) =>
          a.videoTitle.localeCompare(b.videoTitle)
        );
        break;

      case "ALFABETICAL_DESC":
        sortedList = [...sortedList].sort((a, b) =>
          b.videoTitle.localeCompare(a.videoTitle)
        );
        break;

      case "NEWEST_DESC":
        sortedList = sortedList.sort((a, b) => 
          new Date( a.uploadDate) -  new Date(b.uploadDate)
        );
        break;

      case "NEWEST_ASC":
        sortedList = sortedList.sort((a, b) => new Date( b.uploadDate) - new Date( a.uploadDate));
        break;

      default:
        sortedList = sortedList.sort((a, b) => 
          new Date( a.uploadDate) -  new Date(b.uploadDate)
        );
        break;
    }
    setSortMethod(SORT)
    return sortedList;
  };
  const deleteItemFromList = (item) => {
    const removeItemFromLocalStorage = item => {
      let items = JSON.parse(localStorage.getItem("movieList"));
      items = items.filter(i => i.uuid !== item.uuid)
      localStorage.setItem('movieList',  JSON.stringify(items));
    } 
    let listWithoutItem = [...list];
    listWithoutItem = listWithoutItem.filter(el => el.uuid !== item.uuid)
    setList(listWithoutItem);
    removeItemFromLocalStorage(item);    
  }

  return (
    <ListContext.Provider value={list}>
      <ListSetContext.Provider value={setListAndAddToLocalStorage}>
        <ListContextUpdate.Provider value={addListItem}>
          <ListContextReset.Provider value={resetListItems}>
            <ListContextSort.Provider value={sortList}>
              <ListContextItemDelete.Provider value={deleteItemFromList}>
                  <CurrentPageContext.Provider value={[currentPage, setCurrentPage]}>
                    <ListUpdateContext.Provider value={updateList}>
                      <ListLoadingContext.Provider value={[loading, setLoading]}>
                        {children}
                      </ListLoadingContext.Provider> 
                    </ListUpdateContext.Provider> 
                  </CurrentPageContext.Provider> 
              </ListContextItemDelete.Provider>
            </ListContextSort.Provider>
          </ListContextReset.Provider>
        </ListContextUpdate.Provider>
      </ListSetContext.Provider>
    </ListContext.Provider>
  );
};

export default ListProvider;
