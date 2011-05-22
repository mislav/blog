require 'guard/guard'
require 'fileutils'

::Guard.module_eval do
  def self.get_guard_class(name)
    tried_gem = false
    begin
      self.const_get(self.constants.find {|c| c.to_s.downcase == name.downcase })
    rescue TypeError
      if !tried_gem
        try_to_load_gem name
        tried_gem = true
        retry
      else
        UI.error "Could not find Guard::#{name.capitalize} - make sure 'guard-#{name}' is installed"
      end
    end
  end
end

class ::Guard::Sass < ::Guard::Guard
  def initialize(watchers = [], options = {})
    super
    require 'sass' unless defined? ::Sass
  end
  
  def run_on_change(paths)
    paths.reject { |p| File.basename(p).index('_') == 0 }.each do |file|
      render_file(file)
    end
  end
  
  def run_all
    all_files = Dir.glob('**/*.*')
    paths = ::Guard::Watcher.match_files(self, all_files)
    run_on_change(paths)
  end
  
  def render_file(file)
    source = File.read(file)
    type = file.match(/\w+$/)[0].to_sym
    outfile = file.sub(/\.\w+$/, '.css')
    content = ::Sass::Engine.new(source, @options.merge(:syntax => type)).render

    File.open(outfile, 'w') { |f| f << content }
    puts "Rendered #{outfile}"
  end
end

class ::Guard::Jekyll < ::Guard::Guard
  def initialize(watchers = [], options = {})
    super
    require 'jekyll' unless defined? ::Jekyll
    @working_dir = Dir.pwd
  end
  
  def init_site
    jekyll_options = ::Jekyll::configuration(@options)
    @site = ::Jekyll::Site.new(jekyll_options)
    @destination = jekyll_options['destination'].sub("#{@working_dir}/", '').chomp('/') + '/'
  end
  alias_method :start, :init_site
  alias_method :reload, :init_site
  
  def run_all
    puts "Rebuilding site..."
    @site.process
  end
  
  def run_on_change(paths)
    paths = sanitize_paths(paths)
    if paths.any?
      init_site if paths.include? '_config.yml'
      run_all 
    end
  end
  
  def sanitize_paths(paths)
    paths.reject { |p| ignore_file?(p) }
  end
  
  # matches Gemfile, Rakefile, Guardfile, etc.
  IGNORE_RE = /^[A-Z][a-z]*file$/
  
  def ignore_file?(file)
    file.index(@destination) == 0 || file =~ IGNORE_RE
  end
end

guard 'sass', :style => :compressed do
  watch(%r{^stylesheets/.+\.s[ca]ss$})
end

guard 'jekyll' do
  watch(%r{.+})
  # watch(%r{.+}) do |match|
  #   file = match[0]
  # 
  #   if file =~ /\.s[ca]ss$/
  #     nil
  #   elsif file =~ /\.css$/ && file.index('_site/') != 0
  #     FileUtils.cp(file, "_site/#{file}", :verbose => true)
  #     nil
  #   else
  #     file
  #   end
  # end
end

guard 'livereload', :apply_js_live => false, :grace_period => 0 do
  ext = %w[js css png gif html md markdown xml]

  watch(%r{.+\.(#{ext.join('|')})$}) do |match|
    file = match[0]
    file unless file =~ /^_(?:site|tmp)\//
  end
end
