# Kids, this is when you can't program boiler plate code
# in a different language than the one that the code is written in
# and you had enough and you have to create a backend for your
# frontend.

from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

# Source: https://stackoverflow.com/questions/61488790/how-can-i-proportionally-mix-colors-in-python
def combine_hex_values(d):
    d_items = sorted(d.items())
    tot_weight = sum(d.values())
    red = int(sum([int(k[:2], 16)*v for k, v in d_items])/tot_weight)
    green = int(sum([int(k[2:4], 16)*v for k, v in d_items])/tot_weight)
    blue = int(sum([int(k[4:6], 16)*v for k, v in d_items])/tot_weight)
    zpad = lambda x: x if len(x)==2 else '0' + x
    
    return (zpad(hex(red)[2:]) + zpad(hex(green)[2:]) + zpad(hex(blue)[2:])).upper()

class ColorMixing(Resource):
    def get(self, color):
        color1 = color.split("-")[0]
        color2 = color.split("-")[1]

        print(combine_hex_values({color1: 1, color2: 1}))
        return {'combined_color': combine_hex_values({color1: 1, color2: 1})}

api.add_resource(ColorMixing, '/color_mixing/<string:color>')

if __name__ == '__main__':
    app.run(
        host='localhost',
        port=5000,
        debug=True
    )