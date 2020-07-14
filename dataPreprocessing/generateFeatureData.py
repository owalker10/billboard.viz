import pandas as pd
import re
import spotipyUtils as sp
import numpy as np


# ['1940','1950','1960','1970','1980','1990','2000','2010']
decades = ['1940']

# ['acousticness','danceability','energy','instrumentalness','liveness','loudness','speechiness','valence','tempo']
features = ['acousticness','danceability','energy','instrumentalness','loudness','speechiness','valence','tempo']

def open_raw_csvs():
    decade_dfs = []
    for decade in decades:
        df = pd.read_csv('decadeBillboards/{}s.csv'.format(decade),header=0,names=['date','artist','song','label','weeks','annotation'],encoding='Latin-1')
        decade_dfs.append(df)

    return decade_dfs

def open_clean_csvs():
    decade_dfs = []
    for decade in decades:
        df = pd.read_csv('cleanedDecades/{}s_clean.csv'.format(decade),header=0,encoding='Latin-1',na_values=None)
        decade_dfs.append(df)

    return decade_dfs

def clean_dfs(dfs):
    ret = []
    for df in dfs:
        df['top_year'] = pd.to_datetime(df['date']).dt.year
        df = df[df[['top_year','artist','song']].notnull().all(1)]
        df = df.reset_index(drop=True)
        df['song'] = df['song'].apply(lambda name: re.sub(r'[\?"]','',name)) # remove quotes and unknown characters
        ret.append(df[['top_year','artist','song']])
    return ret

def init_json():
    json = {}
    json['features'] = {}
    for feat in features:
        json['features'][feat] = {}
    json['decades'] = {}

    return json

def append_api_values(row):
    result = sp.search(row['song'],row['artist'])
    for key, value in result.items():
        row[key] = value
    return row

def add_features(df,sfs):
    def add_features_to_row(row,feats):
        for f in features:
            if not feats:
                row[f] = np.nan
            else:
                row[f] = feats[f]
        return row
        
    df = df.apply(lambda row: add_features_to_row(row,sfs[row.name]),axis=1)
    return df



if __name__ == '__main__':
    run = 'to json'

    if run == 'to csv': # raw data to cleaned csv so I can go in and patch any holes that Spotify search couldn't find
        dfs = open_raw_csvs()
        dfs = clean_dfs(dfs)
        for i, df in enumerate(dfs):
            print('{}\'s'.format(decades[i]),'-----------------')
            with_api_data = df.apply(lambda row: append_api_values(row), axis=1) # not with audio features yet
            #print(with_api_data)
            with_api_data.to_csv('cleanedDecades/{}s_clean.csv'.format(decades[i]), index=False, encoding='Latin-1')
        # pd.tocsv

    elif run == 'to json': # take cleaned csv's, get feature data, save formatted data as a json
        dfs = open_clean_csvs()
        
        for i, df in enumerate(dfs):
            song_features = sp.get_features(df['id'],features)
            dfs[i] = add_features(df,song_features)
            print(dfs[i])
        

            
        


