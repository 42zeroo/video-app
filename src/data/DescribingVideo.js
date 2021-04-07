import uuid from 'react-uuid'
import axios from 'axios';

class DescribingVideo {
    static MakeVideoObjectFromYoutube(data) {
        return {
            uuid: uuid(),
            movieId: data.id,
            thumbnail: data.snippet.thumbnails.standard?.url ?? data.snippet.thumbnails.default.url,
            videoTitle: data.snippet.localized.title,
            plays: data.statistics.viewCount,
            likes: data.statistics.likeCount,
            uploadDate: new Date(data.snippet.publishedAt),
            favorite: false,
            addedToListDate: new Date(Date.now()),
            site: 'youtube'
        }
    }
    static MakeVideoObjectFromVimeo(data) {
        return {
            uuid: uuid(),
            movieId: data.uri.split('/')[2] ?? "",
            thumbnail: data.pictures.sizes[4].link ?? "",
            videoTitle: data.name ?? "",
            plays: data.stats.plays ?? 0,
            likes: data.metadata.connections.likes.total ?? 0,            
            uploadDate: new Date(data.release_time) ?? "",
            favorite: false,
            addedToListDate: new Date(Date.now()),
            site: 'vimeo',
            embed: data.embed.html
        }
    }
    static MakeVideoObject(fetchedData){
        let data;
        switch(fetchedData?.siteType){
            case 'youtube':
                data = fetchedData.response.data.items[0]
                return DescribingVideo.MakeVideoObjectFromYoutube(data)
            
            case 'vimeo':
                data = fetchedData.response.data
                return DescribingVideo.MakeVideoObjectFromVimeo(data)

            default:
                alert("Podany format nie jest obslugiwany!\nPodaj filmik z youtuba albo vimeo.\nMozesz tez podac ID filmu z tych stron.")
        }
    }
    static async FetchVideoData(link){
        if(link === "") return;
        //by default site is youtube
        let site = 'youtube'
        let url  = link.split('/');
        let movieId = url[url.length-1];
        //but vimeo video id contains only numbers, so if it can be parse to number, then site is vimeo
        if(Number(movieId)) site = 'vimeo';
        try{
            switch(site){
                case 'youtube':
                    if(movieId.includes('watch?v=')) movieId = movieId.slice(8); 
                    return {
                        response: await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${movieId}&key=${process.env.REACT_APP_YOUTUBE_ACCESS_TOKEN}&part=snippet,statistics`),
                        siteType: site,
                    }
                    
                case 'vimeo':
                    return { 
                        response: await axios.get('https://api.vimeo.com/videos/'+movieId,{
                            headers:{
                                 Authorization: `Bearer ${process.env.REACT_APP_VIMEO_ACCESS_TOKEN}`,
                                'Accept': 'application/vnd.vimeo.*+json;version=3.4',
                                'Content-Type': 'application/json' }
                            }),
                        siteType: site,
                    }
                    
                default:
                    break;
            }
        }catch(err){
            console.log(err)
        }
    }
     static async ListFromLinks(Links){
        let list = []
        for(const link of Links){
            let fetchedData = await DescribingVideo.FetchVideoData(link);
            let obj =  DescribingVideo.MakeVideoObject(fetchedData)
            list.push(obj)
        }
        return list;
      };
    
      static AddVideoToLocalStorageList(obj){
        let currentLocalStorageItems = JSON.parse(localStorage.getItem('movieList'));
        if (currentLocalStorageItems === null) currentLocalStorageItems = [];
        currentLocalStorageItems.push(obj);
        localStorage.setItem('movieList',  JSON.stringify(currentLocalStorageItems));
    } 
}

export default DescribingVideo
