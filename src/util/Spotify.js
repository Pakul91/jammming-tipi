const clientId = "31fbd25a484b4aea860fa6d27dd91537";
const redirectUri = "http://localhost:3000/";
// const redirectUri = "https://jammming-tipi.surge.sh";
// const redirectUri = "https://jammming-tipi.netlify.app/";

let setToDisconnected;
let accessToken;
const storage = window.localStorage;

const Spotify = {
  //import function from othe component and assing in to a variable
  // In this case we will import from App.js and function will allow to change isConected state in App
  importFunction(foo) {
    setToDisconnected = foo;
  },

  // Set timer to clear the the parameters and url, set App state to disconected, end remove expiryTime from localStorage
  // If parameter 'false' or empty function will execute after calculated time. If true will execute immediately
  clearAndDisconnect(now = false) {
    window.setTimeout(
      () => {
        accessToken = "";
        window.history.pushState("Access Token", null, "/");
        setToDisconnected();
        storage.removeItem("expiryTime");
        // if parameter passed = false || empty timeout will be the difference between saved time stamp and now. If true timer = 0
      },
      now ? 0 : storage.getItem("expiryTime") - Date.now()
    );
  },

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    //check for the access token match in the url
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    //If match
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      //if there is no expiryTime saved in the storage create one from now + expiresIn extracted from url
      if (!storage.getItem("expiryTime")) {
        storage.setItem("expiryTime", Date.now() + expiresIn * 1000);
        this.clearAndDisconnect();
      }

      //if there is no expiryTime saved in the storage and its time stamp i bigger then now:
      if (
        storage.getItem("expiryTime") &&
        storage.getItem("expiryTime") > Date.now()
      ) {
        this.clearAndDisconnect();
      }

      //if there is no expiryTime saved in the storage and its time stamp i smaller then now:
      if (
        storage.getItem("expiryTime") &&
        storage.getItem("expiryTime") <= Date.now()
      ) {
        this.clearAndDisconnect(true);
        this.getAccessToken();
        return;
      }

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

      window.location = accessUrl;
      // window.history.pushState({}, "", accessUrl);
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();

    const url = `https://api.spotify.com/v1/search?type=track&q=${term}&limit=50`;

    try {
      console.log(accessToken);
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((jsonResponse) => {
          if (!jsonResponse.tracks) {
            return [];
          }

          return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview: track.preview_url === null ? "" : track.preview_url,
            playing: false,
          }));
        });
    } catch (error) {
      console.log(error.message);
    }
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => {
        // May be BUGGY
        return response.json();
      })
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        });
      })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;

        return fetch(
          `https://api.spotify.com/v1/users/{user_id}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackUris }),
          }
        );
      });
  },
};

export default Spotify;
