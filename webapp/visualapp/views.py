from django.shortcuts import render
#from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def about(request):
    team_mates = {
					"San Kho lin": "s.lin36@student.unimelb.edu.au",
                  	"Derui Wang": "d.wang38@student.unimleb.edu.au",
                  	"Zhiqiang Fang": "z.fang8@tudent.unimelb.edu.au",
                  	"Alan Chen":"a.chen15@student.unimelb.edu.au",
					"Bingfeng Liu": "b.liu1234@student.unimelb.ed.au"}
    return render(request, 'about.html', {"team_mates": team_mates})


# Create your views here.
