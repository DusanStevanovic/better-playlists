import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


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
    return (
      <div style={{width: '40%', display: 'inline-block'}}>
        <h2 style={{color: '#ffffff'}}>{Math.round(totalDuration / 60)} hours</h2>
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
      <div>
        <img />
        <h3>{playlist.name}</h3>
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
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 1000);

    setTimeout(() => {
      this.setState({filterString: ''});
    }, 2000);
  }
  render() {

    let playlistToRender = this.state.serverData.user ? this.state.serverData.user.playlists
      .filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase()
        )
    ) : []

    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
          <h1>
            {this.state.serverData.user && this.state.serverData.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={playlistToRender} />
          <HoursCounter playlists={playlistToRender} />
        <Filter onTextChange={text => this.setState({ filterString: text })} />
        {playlistToRender.map(playlist =>
          <Playlist playlist={playlist} />
        )}
        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
