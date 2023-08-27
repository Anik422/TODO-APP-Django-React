from django.shortcuts import render
from .serializers import TodoSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.http import Http404
from .models import Todo
# Create your views here.



class TodoView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            todos = Todo.objects.all().order_by('-id')
            todo_serializer = TodoSerializer(todos, many=True)
            return Response(todo_serializer.data, status.HTTP_200_OK)
        except Exception as e:
            return Response({"details": e}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        todo_serializer = TodoSerializer(data=request.data)
        if todo_serializer.is_valid():
            todo_serializer.save()
            return Response(todo_serializer.data, status=status.HTTP_201_CREATED)
        return Response(todo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class TodoDetailView(APIView):
    def get_object(self, pk):
        try:
            return Todo.objects.get(pk=pk)
        except Todo.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        todo = self.get_object(pk)
        todo_serializer = TodoSerializer(todo)
        return Response(todo_serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk, format=None):
        todo = self.get_object(pk)
        todo_serializer = TodoSerializer(todo, data=request.data)
        if todo_serializer.is_valid():
            todo_serializer.save()
            return Response(todo_serializer.data, status=status.HTTP_200_OK)
        return Response(todo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        todo = self.get_object(pk)
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)