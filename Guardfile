require 'guard/guard'
require 'jekyll'
require 'fileutils'

notification :off

class ::Guard::Jekyll < ::Guard::Guard
  attr_reader :workdir

  def initialize(watchers = [], options = {})
    super
    @site = nil
    @workdir = Dir.pwd
  end

  def init_site
    jekyll_options = ::Jekyll::configuration(@options)
    @site = ::Jekyll::Site.new(jekyll_options)
    @destination = jekyll_options['destination']
  end
  alias_method :start, :init_site
  alias_method :reload, :init_site

  def run_all
    puts "Rebuilding Jekyll site... "
    @site.process
    puts "done."
  end

  def run_on_change paths
    init_site if paths.include? '_config.yml'
    return unless @site
    if paths.size == 1 and paths.first =~ /\.css$/
      css_file = paths.first
      puts "Copying #{css_file} to #{@destination}"
      FileUtils.cp css_file, File.join(@destination, css_file)
    else
      run_all
    end
    notify paths
  end

  def notify changed_files
    ::Guard.guards.each do |guard|
      next if self.class === guard
      paths = ::Guard::Watcher.match_files(guard, changed_files)
      guard.run_on_change(paths) unless paths.empty?
    end
  end
end

guard 'jekyll', :all_on_start => true do
  ignores = %r{^(?:\.|_tmp|_site|public|Guardfile)\b|\.(scss|sass)$}

  watch(%r{.+}) do |match|
    file = match[0]
    file unless file =~ ignores
  end
end

guard 'sass', :input => 'stylesheets', :all_on_start => true, :style => :compressed

guard 'livereload', :apply_js_live => false, :grace_period => 0 do
  ext = %w[js css png gif html md markdown xml]

  watch(%r{^public(/.+\.(?:#{ext.join('|')}))$}) do |match|
    match[1].sub(/\/index\.html$/, '/')
  end
end
