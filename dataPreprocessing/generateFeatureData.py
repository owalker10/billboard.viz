import pandas as pd
import re
import spotipyUtils as sp
import numpy as np
import os
import json
import pprint
pp = pprint.PrettyPrinter(indent=2)


# ['1940','1950','1960','1970','1980','1990','2000','2010']
decades = ['1940','1950','1960','1970','1980','1990','2000','2010']

# ['acousticness','danceability','energy','instrumentalness','liveness','loudness','speechiness','valence','tempo']
features = ['acousticness','danceability','energy','instrumentalness','loudness','speechiness','valence','tempo']

# load wikipedia csvs to dataframes
def open_raw_csvs():
    decade_dfs = []
    for decade in decades:
        if decade == '1970':
            df = pd.read_csv('decadeBillboards/{}s.csv'.format(decade),names=['date','artist','song','weeks','annotation'],encoding='Latin-1')
        elif decade[0] == '2': # 2000 and 2010 are special
            df = pd.read_csv('decadeBillboards/{}s.csv'.format(decade),names=['date','artist','song','weeks'],encoding='Latin-1')
        else:
            df = pd.read_csv('decadeBillboards/{}s.csv'.format(decade),names=['date','artist','song','label','weeks','annotation'],encoding='Latin-1')
        decade_dfs.append(df)

    return decade_dfs

# load csvs that I cleaned into dataframes
def open_clean_csvs():
    decade_dfs = []
    for decade in decades:
        df = pd.read_csv('cleanedDecades/{}s_clean.csv'.format(decade),header=0,encoding='Latin-1')
        decade_dfs.append(df)

    return decade_dfs

'''
take data from wikipedia and:
    take the year from the "first reached #1" date
    remove the null rows (in wikipedia table these are year headers)
    reset the index so no missing numbers
    remove unwanted characters
    grab the columns we want
'''
def clean_dfs(dfs):
    ret = []
    for df in dfs:
        df['top_year'] = pd.to_datetime(df['date']).dt.year
        df = df[df[['top_year','artist','song']].notnull().all(1)]
        df = df.reset_index(drop=True)
        df['song'] = df['song'].apply(lambda name: name.split('[')[0].strip()) # remove [....]

        df['song'] = df['song'].apply(lambda name: re.sub(r'[\?"]','',name)) # remove quotes and unknown characters
        ret.append(df[['top_year','artist','song','weeks']])
    return ret

# initialize the json object as a dict with the keys we need
def init_json():
    data = {}
    data['features'] = {}
    for feat in features:
        data['features'][feat] = {}
    data['decades'] = {}
    for d in decades:
        data['decades']['${}'.format(d)] = {}
        data['decades']['${}'.format(d)]['features'] = {}

    return data

# search for the song with the Spotify API and add the data we get (song id, url, etc)
def append_api_values(row):
    result = sp.search(row['song'],row['artist'])
    for key, value in result.items():
        row[key] = value
    return row

# take the decade data frame and song audio features and mush them together :)
def add_features(df,sfs):
    def add_features_to_row(row,feats):
        for f in features:
            if not feats:
                row[f] = np.nan # features are NaN if the search failed
            else:
                row[f] = feats[f]
        return row
        
    df = df.apply(lambda row: add_features_to_row(row,sfs[row.name]),axis=1)
    return df

# change a row into an object-like dictionary with keys of col_names plus "features"
def to_dict(row,col_names):
    ret = {}
    for c in col_names:
        ret[c] = row[c]
    ret['features'] = {}
    for f in features:
        if np.isnan(row[f]): # json doesnt like NaN so we do 0
            ret['features'][f] = 0
        else:
            ret['features'][f] = row[f]

    return ret


def fix_loudness():
    with open('data.json') as data_file:
        data = json.load(data_file)
        for decade in data['features']['loudness'].keys():
            data['features']['loudness'][decade] = 1 - data['features']['loudness'][decade]
            data['decades'][decade]['features']['loudness'] = 1 - data['decades'][decade]['features']['loudness']
            for i in range(len(data['decades'][decade]['songs'])):
                data['decades'][decade]['songs'][i]['features']['loudness'] = 1 - data['decades'][decade]['songs'][i]['features']['loudness']
        with open('data2.json','w') as out_file:
            json.dump(data,out_file)


if __name__ == '__main__':
    run = 'to json'

    if run == 'to csv': # raw data to cleaned csv so I can go in and patch any holes that Spotify search couldn't find
        dfs = open_raw_csvs()
        dfs = clean_dfs(dfs)
        for i, df in enumerate(dfs):
            print('{}\'s'.format(decades[i]),'-----------------')
            with_api_data = df.apply(lambda row: append_api_values(row), axis=1) # not with audio features yet
            with_api_data.to_csv('cleanedDecades/{}s_clean.csv'.format(decades[i]), index=False, encoding='Latin-1')

    elif run == 'to json': # take cleaned csv's, get feature data, save formatted data as a json
        dfs = open_clean_csvs()
        data = init_json()
        
        for i, df in enumerate(dfs):
            print('{}\'s'.format(decades[i]),'-----------------')
            # get audio features and slap them on dataframe
            song_features = sp.get_features(df['id'],features)
            dfs[i] = add_features(df,song_features)
            # average them
            mean_features = dfs[i][features].mean()
            # add the data to the json
            for f in features:
                data['features'][f]['${}'.format(decades[i])] = mean_features[f]
                data['decades']['${}'.format(decades[i])]['features'][f] = mean_features[f]
  
            data['decades']['${}'.format(decades[i])]['songs'] = dfs[i].apply(lambda row: to_dict(row,['top_year','weeks','artist','song','url']),axis=1).tolist()
            
        with open('data.json','w') as file:
            json.dump(data,file)
        pp.pprint(data)
        


        
        


            
        





