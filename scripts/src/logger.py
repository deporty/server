class Logger:
  def __init__(self, route):
    self.__log_content__ = []
    self.route = route
    
  def log(self, data):
    self.__log_content__.append(data)
    
  def save(self,):
    with open(self.route, 'w') as f:
      f.write('\n'.join(self.__log_content__))