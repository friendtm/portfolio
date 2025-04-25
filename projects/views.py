import requests
from django.shortcuts import render
from .models import Project

# Create your views here.
def index(request):
    admin_projects = Project.objects.all().order_by('-created_at')

    github_repos = []
    username = 'friendtm'
    url = f'https://api.github.com/users/{username}/repos'
    response = requests.get(url)

    if response.status_code == 200:
        for repo in response.json():
            if not repo.get('private'):
                github_repos.append({
                    'name': repo['name'],
                    'description': repo['description'],
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'updated_at': repo['updated_at'],
                })
    repos_list = list(github_repos)
    
    return render(request, 'projects/index.html', {
        'admin_projects': admin_projects,
        'github_repos': repos_list,
    })