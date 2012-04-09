require 'guard/guard'
gem 'sass' if defined? Gem

require 'jekyll/live_site'
require 'pygments'
# if I don't do this now, rendering posts with vim later fails!
Pygments.highlight 'set nocompatible', :lexer => 'vim'

class ::Guard::Jekyll < ::Guard::Guard
  attr_reader :workdir

  def initialize(watchers = [], options = {})
    super
    @site = nil
    @workdir = Dir.pwd
  end

  def init_site
    jekyll_options = ::Jekyll::configuration(@options)
    @site = ::Jekyll::LiveSite.new(jekyll_options)
    @destination = jekyll_options['destination']
    @site.read
  end
  alias_method :start, :init_site
  alias_method :reload, :init_site

  def run_all
    print "Rebuilding Jekyll site... "
    @site.process
    puts "done."
  end

  def run_on_change paths
    init_site if paths.include? '_config.yml'
    return if @site.nil?
    render_files paths
  end

  def render_files paths
    changed = []
    @site.process_files paths do |processed|
      changed << processed
      puts "Jekyll: #{processed.sub("#{workdir}/", '')}"
    end

    notify changed if changed.any?
  end

  def notify changed_files
    ::Guard.guards.each do |guard|
      next if self.class === guard
      paths = ::Guard::Watcher.match_files(guard, changed_files)
      guard.run_on_change(paths) unless paths.empty?
    end
  end
end

guard 'sass', :style => :compressed, :input => 'stylesheets', :all_on_start => true

guard 'jekyll' do
  ignores = %r{^(?:_tmp|_site|public)/|\.s[ca]ss$}

  watch(%r{.+}) do |match|
    file = match[0]
    file unless file =~ ignores
  end
end

guard 'livereload', :apply_js_live => false, :grace_period => 0 do
  ext = %w[js css png gif html md markdown xml]

  watch(%r{^public(/.+\.(?:#{ext.join('|')}))$}) do |match|
    match[1].sub(/\/index\.html$/, '/')
  end
end
