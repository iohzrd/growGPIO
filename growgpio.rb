#!/usr/bin/env ruby
require 'time'
require 'json'
require 'rpi_gpio'
require 'celluloid/current'

RPi::GPIO.set_numbering :board
pin = {1=>5,2=>7,3=>8,4=>10,5=>11,6=>12,7=>13,8=>15,9=>16,10=>18,11=>19,12=>21,13=>22,14=>23,15=>24,16=>26}
for i in 1..16
    RPi::GPIO.setup pin[i], :as => :output, :initialize => :high
end

class Timer
    attr_reader :state
    def initialize(i)
        @state = 'high'
        puts "Relay#{i} Timer initialized"
    end
    def off(i, pin)
        @state = 'high'
        puts "Relay#{i} Timer fired off"
        RPi::GPIO.set_high pin
    end
    def on(i, pin)
        @state = 'low'
        puts "Relay#{i} Timer fired onn"
        RPi::GPIO.set_low pin
    end
end

class Interval
    include Celluloid
    attr_reader :fired, :timer
    def initialize(i)
        @fired = false
        @timer = after(0) { puts "Relay#{i} Intervals initialized" }
    end
    def reset(i, onn, off, pin)
        @fired = true
        @timer = after(0) { puts "Relay#{i} Intervals fired onn!"; RPi::GPIO.set_low pin }
        @timer = after(onn) { puts "Relay#{i} Intervals fired off!"; RPi::GPIO.set_high pin }
        @timer = after(onn+off) { puts "Relay#{i} Intervals reset!"; @fired = false }
    end
end

Thread.new do
    sleep 1
    time = {}
    interval = {}
    loop do
        t = Time.now()
        now = t.strftime("%H:%M")
        config_file = File.read('config.json')
        config_hash = JSON.parse(config_file)
        for i in 1..16
            if config_hash.has_key?('Times') == true
                if config_hash['Times'].has_key?("Relay#{i}") == true
                    if time[i].nil? == true
                        time[i] = Timer.new(i)
                    end
                    config_hash['Times']["Relay#{i}"]['On'].each_with_index do |value, index| 
                        if now >= value and now < config_hash['Times']["Relay#{i}"]['Off'][index] and time[i].state == 'high'
                            time[i].on(i, pin[i])
                        end
                    end
                    config_hash['Times']["Relay#{i}"]['Off'].each_with_index do |value, index|
                        unless config_hash["Times"]["Relay#{i}"]['On'][index + 1].nil?
                            if now >= value and now < config_hash['Times']["Relay#{i}"]['On'][index + 1] and time[i].state == 'low'
                                time[i].off(i, pin[i])
                            end
                        else
                            if now >= value and time[i].state == 'low'
                                time[i].off(i, pin[i])
                            end
                        end
                    end
                else
                    time[i] = nil
                end
            end
            if config_hash.has_key?('Intervals') == true
                if config_hash['Intervals'].has_key?("Relay#{i}") == true
                    if interval[i].nil? == true
                        interval[i] = Interval.new(i)
                    elsif interval[i].fired == false
                        interval[i].reset(i, config_hash['Intervals']["Relay#{i}"]['On'].to_i*60, config_hash['Intervals']["Relay#{i}"]['Off'].to_i*60, pin[i])
                    end
                else
                    interval[i] = nil
                end
            end
            sleep 0.0625
        end
        GC.start(full_mark: true, immediate_sweep: true);
    end
end

at_exit { puts "Cleaning up and shutting down."; RPi::GPIO.clean_up }

require 'sinatra'
set :bind, '0.0.0.0'
set :port, 4200
get '/' do
    config_file = File.read('config.json')
    @config = config_file.gsub( / *\n+/, "" )
    erb :form
end

post '/' do
    systime = params['SystemTime']
    puts systime
    cmd = 'sudo date --set=' + '"' + systime + '"'
    system(cmd)
    params.delete("SystemTime")
    open('config.json', 'w') do |a|
        a.puts JSON.pretty_generate(params)
    end
    config_file = File.read('config.json')
    @config = config_file.gsub( / *\n+/, "" )
    erb :form
end
