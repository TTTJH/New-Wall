import json #用于结果json化
import pymongo
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import jieba
jieba.add_word('不会吧')
jieba.add_word('yysy')
from jieba.analyse import *
client = pymongo.MongoClient(host='localhost',port=27017)

db = client['new-wall']

cards = db.cards

result = cards.find({})

text = ""
list = []
for item in result:
    if 'content' in item:
        text += item['content']
for keyword, weight in extract_tags(text, withWeight=True):
    # print('%s %s' % (keyword, weight))
    dict = {"keyword":keyword,"weight":weight}
    list.append(dict)
    if len(list) >= 1:#只提取一个关键词
        break

print(json.dumps(list,ensure_ascii=False))
