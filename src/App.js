import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';


let fakeServerData = {
  user: {
    name: 'Dusan',
    playlists:[
      {
        name: 'My Favorites',
        songs: [
            {name: 'Beat it', duration: 1345},
            {name: 'dasdsada', duration: 3434},
            {name: 'nanan', duration: 3434}
          ]
      },
      {
        name: 'Discover Weekly',
        songs: [
            {name: 'Beat it', duration: 1345},
            {name: 'Abba', duration: 3434},
            {name: 'nanan', duration: 3434}
          ]
      },
      {
        name: 'Another Playlist - the best',
        songs: [
            {name: 'this is who we are', duration: 1345},
            {name: 'dasdsada', duration: 3434},
            {name: 'nanan', duration: 3434}
          ]
      },
      {
        name: 'the Playlist - new',
        songs: [
            {name: 'Beat it', duration: 1345},
            {name: 'dasdsada', duration: 3434},
            {name: 'nanan', duration: 3434}
          ]
      },
    ]
  }
}
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{width: '40%', display: 'inline-block'}}>
        <h2 style={{color: '#ffffff'}}>{this.props.playlists && this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {

  let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, []);

  let totalDuration = allSongs.reduce((sum, eachSong) => {
    return sum + eachSong.duration;
  }, 0)
  let totalDurationHours = Math.round(totalDuration / 60)
  let isTooLow = totalDurationHours < 40
  let hoursCounterStyle = {
    width: '40%',
    display: 'inline-block',
    color: isTooLow ? 'darkred' : 'white'
  }
    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDurationHours} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{ display: 'inline-block', width: '25%' }}>
        <h3>{playlist.name}</h3>
        <img src={playlist.images} />
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    if (!accessToken) {
      return;
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }));

    fetch('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.playlists.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDatasPromises = 
        Promise.all(trackDataPromises)
        let playlistsPromise =  allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name,
          songs: item.trackDatas.slice(0, 3),
          href: item.href,
          id: item.id,
          images: item.images[0].url
        }
      })
    }))

  }
  render() {

    let playlistToRender =
      this.state.user &&
      this.state.playlists ? this.state.playlists
      .filter(playlist => {
        let matchesPlaylist = playlist.name.toLowerCase()
          .includes(this.state.filterString.toLowerCase())

        let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
          .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
      }
    ) : []

    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1>
            {this.state.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={playlistToRender} />
          <HoursCounter playlists={playlistToRender} />
          <Filter onTextChange={text => this.setState({ filterString: text })} />
        {playlistToRender.map(playlist =>
          <Playlist playlist={playlist} />
        )}
        </div> : <button onClick={() => window.location = 'http://localhost:8888/login'} style={{ padding: '20px', margin: '200px auto' }}>sign in</button>
        }
      </div>
    );
  }
}

export default App;
