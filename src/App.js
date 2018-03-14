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
      <ul>
        <li key={playlist.id}>
        <h3>{playlist.name}</h3>
        <img src={playlist.images} />
        <a href={playlist.href} style={{border: '1px solid #000', padding: '20px', background: '#ffffff'}}>Click Here !</a>
        </li>
      </ul>
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
    .then(data => this.setState({
      playlists: data.playlists.items.map(item => ({
        name: item.name,
        songs: [],
        href: item.href,
        id: item.id,
        images: item.images[0].url
      }))
    }))

  }
  render() {

    let playlistToRender =
      this.state.user &&
      this.state.playlists ? this.state.playlists
      .filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase()
        )
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
