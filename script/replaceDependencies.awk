#!/usr/bin/env sh
sudo -v

files=0;
for file in $(find ../src/ -name *.coffee)
do
  #sed -E -i'.txt' '/<DEFINE>/,/<\/DEFINE>/d' $file
  fname=$(basename $file)

  awk '
  BEGIN {
    print "# <DEFINE>"

    print "define ["
  }
  /= +?require\(/ { 
    ++num
    if (NR > last) { last = NR }

    modules[$2] = NR;
  }
  END {
    for (name in modules) {
      print "  \x27" "cs!" name "\x27" ","
      if (modules[name] == num) { print "# LAST" }
    }

    print "], ("

    for (name in modules) {
      print "  \x27" name "\x27" ","
      if (modules[name] == num) { print "# LAST" }
    }

    print ") ->"

    print "# </DEFINE>"
    print ""
    print ""
  }
  ' $file > ./tmp/$fname

  cat $file >> ./tmp/$fname

  #sed -E -i'/= *require\(/g' ./tmp/$fname

  cp -f ./tmp/$fname $file

  echo output written to ./tmp/$fname
done

