from math import ceil
import re
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from secrets import CLIENT_ID, CLIENT_SECRET


auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)

def search(track,artist):
    artist = artist.split('featuring')[0].strip()
    q = 'track:"{}" artist:"{}"'.format(track,artist)
    result = sp.search(q,limit=1)

    if len(result['tracks']['items']) == 0: # search UK market instead
        result = sp.search(q,limit=1,market='GB')
    if len(result['tracks']['items']) == 0: # remove / ... from track
        q = 'track:"{}" artist:"{}"'.format(track.split('/')[0].strip(),artist)
        result = sp.search(re.sub(r'[-\.,\'!\(\)]','',q),limit=1)
    if len(result['tracks']['items']) == 0: # remove parenthesis from track
        q = 'track:"{}" artist:"{}"'.format(track.split('(')[0].strip(),artist) 
        result = sp.search(q,limit=1)
    if len(result['tracks']['items']) == 0: # remove & ... from artist
        q = 'track:"{}" artist:"{}"'.format(track,artist.split('&')[0].strip()) 
        result = sp.search(q,limit=1)
    if len(result['tracks']['items']) == 0: # remove "and ..." from artist
        q = 'track:"{}" artist:"{}"'.format(track,artist.split('and')[0].strip()) 
        result = sp.search(q,limit=1)
    if len(result['tracks']['items']) == 0: # filter out punctuation
        result = sp.search(re.sub(r'[-\.,\'!\(\)]','',q),limit=1)

    if len(result['tracks']['items']) == 0:
        print('not found:',track,'-',artist)
        return {
            #'released': ' ',
            'url': ' ',
            'id': 'not_found'
        }

    item = result['tracks']['items'][0]
    year = item['album']['release_date'].split('-')[0]
    url = item['external_urls']['spotify']
    
    return {
        #'track': item['name'],
        #'artist': item['artists'][0]['name'],
        #'released': year,    this release date tends to be inaccurate
        'url': url,
        'id': item['id']
    }

# returns list of objects containing all features or empty dict if id is invalid
def get_features(ids,features):
    features_by_song = []
    for i in range(int(ceil(len(ids)/100))):
        batch = sp.audio_features(tracks=ids[i*100 : i*100 + 100])
        clean_batch = []
        for item in batch:
            clean = {}
            if item is None:
                clean_batch.append(clean)
                continue
            for f in features:
                num = item[f]
                num = round((num+60) / 60, 3) if f == 'loudness' else round(num/250, 3) if f == 'tempo' else num
                clean[f] = num
            clean_batch.append(clean)

        features_by_song.extend(clean_batch)

    return features_by_song
        
def test_search(track,artist):
    artist = artist.split('featuring')[0].strip()
    q = 'track:"{}" artist:"{}"'.format(track,artist)
    print(q)
    result = sp.search(q,limit=1)


    item = result['tracks']['items'][0]
    year = item['album']['release_date'].split('-')[0]
    url = item['external_urls']['spotify']
    
    return {
        'track': item['name'],
        'artist': item['artists'][0]['name'],
        'released': year,
        'url': url,
        'id': item['id']
    }

if __name__ == '__main__':

    #print(get_features(search('Hello','Clairo')['id'],['danceability','energy','loudness']))
    #print(get_features('fakeid',['danceability','energy','loudness']))
    #print(get_features([search('Hello','Clairo')['id'],'fakeid'],['danceability','energy','loudness']))
    #print(search('Green Eyes (Aquellos Ojos Verdes)','Jimmy Dorsey'))
    #print(search("Its Gonna Be Me","N sync"))
    #print(test_search("I Love You For Sentimental Reasons",'King Cole'))
    pass