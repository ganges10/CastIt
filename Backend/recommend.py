import pandas as pd
from scipy.spatial.distance import cosine
import operator
import sys

data = pd.read_csv("prediction_data.csv")

def similarity(a, b):
    mov1=a['Genre_binary'].tolist()[0].strip('][').split(',')
    mov1 =[int(x) for x in mov1]
    mov2=b['Genre_binary'].strip('][').split(',')
    mov2 =[int(x) for x in mov2]
    genreDistance = cosine(mov1,mov2)
  
    mov1_direct=a['Director_binary'].tolist()[0].strip('][').split(',')
    mov1_direct =[int(x) for x in mov1_direct]
    mov2_direct=b['Director_binary'].strip('][').split(',')
    mov2_direct =[int(x) for x in mov2_direct]
    directDistance = cosine(mov1_direct, mov2_direct)
  
    return genreDistance + directDistance

def getNeighbors(baseMovie,ind):
        distances = []
    
        for index, movie in data.iterrows():
          if(index == ind):
            continue
          dist = similarity(baseMovie,movie)
          distances.append((movie['Title'],dist))
    
        distances.sort(key=operator.itemgetter(1))
        neighbors = []
    
        for x in range(0,5):
            neighbors.append(distances[x][0])
        return neighbors

def predict_similar(movie):
  return getNeighbors(data[data['Title']==movie],data.index[data['Title']== movie][0])


movie_name= " ".join(sys.argv[1:])
result = predict_similar(movie_name)
print(*result,sep=',')


